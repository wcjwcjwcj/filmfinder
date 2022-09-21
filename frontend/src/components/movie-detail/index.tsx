import React, { useState, useEffect, useRef } from 'react';
import { Empty, Input, Modal, message, Rate } from 'antd';
import html2canvas from 'html2canvas';
// @ts-ignore
import qrcode from 'qrcode';
// @ts-ignore
import { saveAs } from 'file-saver';

import './index.css';

import {
  PICTURE_PREFIX,
  userAddReview,
  userGetReview,
  userDeleteReview,
  userUpdateReview,
  userRate,
  userGetRate,
  userGetHostIP,
} from '../../service';

const IMG_TYPE = 'image/png';

interface MovieDetailProps {
  data: any;
  visible: boolean;
  onCancel: () => void;
  onAddWishlist?: (id: number) => void;
  isTourists?: boolean;
}

export function MovieDetail(props: MovieDetailProps) {
  const { data = {}, visible, onCancel, isTourists } = props;

  const [reviewContent, setReviewContent] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editNow, setEditNow] = useState('');
  const [editType, setEditType] = useState<'new' | 'edit'>('new');
  const handleReviewSave = () => {
    if (!reviewContent) {
      message.error('Review cannot be empty');
      return;
    }
    if (editType === 'new') {
      userAddReview(data.movie_id, reviewContent).then((res) => {
        if (res.data.code === 0) {
          setShowEdit(false);
          setReviewContent('');
          getReviewList();
        }
      });
    } else {
      userUpdateReview(editNow, reviewContent).then((res) => {
        if (res.data.code === 0) {
          setShowEdit(false);
          setReviewContent('');
          getReviewList();
        }
      });
    }
  };

  const [reviewList, setReviewList] = useState<any[]>([]);
  const getReviewList = () => {
    userGetReview(data.movie_id).then((res) => {
      if (res.data.code === 0) {
        setReviewList(res.data.list);
      }
    });
  };
  useEffect(() => {
    if (data.movie_name) {
      getReviewList();
      if (!isTourists) {
        userGetRate(data.movie_id).then((res) => {
          setRating(res.data.rating);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [rating, setRating] = useState(0);
  const onChangeRate = (e: number) => {
    userRate(data.movie_id, e).then((res) => {
      if (res.data.code === 0) {
        setRating(e);
      }
    });
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const handleShare = () => {
    html2canvas(modalRef.current!, { allowTaint: false }).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, 'share.png');
      }, IMG_TYPE);
    });
  };

  const qrcodeRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    userGetHostIP().then((res) => {
      if (res.data.code === 0) {
        qrcode.toDataURL(
          `http://${res.data.data}:3000/tourists?id=${data.movie_id}`,
          { margin: 1 },
          function (error: any, url: string) {
            if (error || !qrcodeRef.current) {
              return;
            }
            qrcodeRef.current.src = url;
          },
        );
      }
    });
  }, [data]);

  return (
    <Modal
      style={
        isTourists
          ? {
              left: 0,
              top: 0,
              width: '100%',
            }
          : undefined
      }
      onCancel={onCancel}
      width="600px"
      footer={null}
      visible={visible}
    >
      <div className="m-detail">
        <div ref={modalRef} className="m-detail-top">
          <img className="m-detail-qrcode" ref={qrcodeRef} alt=""></img>
          <img
            className="m-detail-img"
            src={`${PICTURE_PREFIX}/${data.picture}?t=${Date.now()}`}
            crossOrigin="anonymous"
            alt=""
          ></img>
          <div className="m-detail-desc">
            <div className="m-detail-tags">
              {data.genre_list?.split('/').map((item: string) => (
                <div key={item} className="m-detail-tag">
                  {item}
                </div>
              ))}
            </div>
            <div className="m-detail-msg">
              <div className="m-detail-msgitem">
                <span className="m-detail-label">Film name: </span>
                {data.movie_name}
              </div>
              <div className="m-detail-msgitem">
                <span className="m-detail-label">Year: </span>
                {data.production_year}
              </div>
              <div className="m-detail-msgitem">
                <span className="m-detail-label">Director: </span>
                {data.director}
              </div>
              <div className="m-detail-msgitem">
                <span className="m-detail-label">Cast: </span>
                {data.cast_list}
              </div>
              <div className="m-detail-msgitem">
                <span className="m-detail-label">Country: </span>
                {data.country}
              </div>
              <div className="m-detail-msgitem">
                <span className="m-detail-label">Synopsis: </span>
                {data.synopsis}
              </div>
              <div className="m-detail-msgitem">
                <span className="m-detail-label">Rating: </span>
                {data.rating}
              </div>
              {isTourists ? null : (
                <div className="m-detail-msgitem">
                  <Rate value={rating} onChange={onChangeRate}></Rate>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          {isTourists ? null : (
            <>
              <div onClick={handleShare} className="m-detail-new">
                Share
              </div>
              {props.onAddWishlist ? (
                <div
                  onClick={() =>
                    props.onAddWishlist && props.onAddWishlist(data.movie_id)
                  }
                  className="m-detail-new"
                >
                  Add to wishlist
                </div>
              ) : null}
              <div
                onClick={() => {
                  setShowEdit(true);
                  setEditType('new');
                }}
                className="m-detail-new"
              >
                New Review
              </div>
            </>
          )}
        </div>
        <div className="m-detail-comment">
          <div className="m-detail-ctitle">
            {data.movie_name}'s review list &nbsp;&nbsp;
            <span className="m-detail-ctitle-num">
              ({reviewList.length} total)
            </span>
          </div>
          <div className="m-detail-list">
            {reviewList && reviewList.length ? (
              reviewList.map((item) => {
                return (
                  <div key={item.review_id} className="m-detail-comment-item">
                    <div className="m-detail-comment-name">
                      {item.acc_name} &nbsp;&nbsp;
                      <span>{item.create_time}</span>
                      &nbsp;&nbsp;
                      {item.can_edit ? (
                        <span
                          onClick={() => {
                            setShowEdit(true);
                            setEditType('edit');
                            setEditNow(item.review_id);
                            setReviewContent(item.review_text);
                          }}
                          style={{ color: 'blue', cursor: 'pointer' }}
                        >
                          Edit
                        </span>
                      ) : null}
                      &nbsp;&nbsp;
                      {item.can_edit ? (
                        <span
                          onClick={() => {
                            userDeleteReview(item.review_id).then((res) => {
                              if (res.data.code === 0) {
                                getReviewList();
                              }
                            });
                          }}
                          style={{ color: 'blue', cursor: 'pointer' }}
                        >
                          Delete
                        </span>
                      ) : null}
                    </div>
                    <div className="m-detail-comment-content">
                      {item.review_text}
                    </div>
                  </div>
                );
              })
            ) : (
              <Empty
                style={{ marginTop: '50px' }}
                description="No reviews yet"
              ></Empty>
            )}
          </div>
        </div>
      </div>
      <Modal
        onOk={handleReviewSave}
        onCancel={() => {
          setShowEdit(false);
          setReviewContent('');
        }}
        visible={showEdit}
      >
        Write a review for 《{data.movie_name}》
        <Input
          value={reviewContent}
          onChange={(e) => {
            setReviewContent(e.target.value);
          }}
          style={{ marginTop: '20px' }}
        ></Input>
      </Modal>
    </Modal>
  );
}
