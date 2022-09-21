import React, { useState } from 'react';
import { Modal } from 'antd';

import './index.css';

import { userSearchByWishlistID } from '../../service';
import MovieList from '../movie-list';

interface WishListProps {
  wishlist: any[];
  isMyWishlist?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onExist?: (id: number) => void;
}

export default function Wishlist(props: WishListProps) {
  const [showMovielist, setShowMovielist] = useState(false);
  const [movieList, setMovieList] = useState<any>([]);

  const handleWishlistDetail = (wishlistID: string) => {
    userSearchByWishlistID(wishlistID).then((res) => {
      if (res.data.code === 0) {
        setMovieList(res.data.movie_list);
        setShowMovielist(true);
      }
    });
  };

  return (
    <div>
      <table className="wishlist">
        <thead>
          <tr className="wishlist-tr">
            <th>Wishlist Name</th>
            <th>Owner</th>
            <th>Public</th>
            {/* <th>Share list</th> */}
            <th>Movie list</th>
            <th>Create Time</th>
            {props.isMyWishlist ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {props.wishlist.map((item) => {
            return (
              <tr key={item.wishlist_id} className="wishlist-tr">
                <td>{item.wishlist_name}</td>
                <td>{item.acc_name}</td>
                <td>{item.public}</td>
                {/* <td>{item.share_list}</td> */}
                <td>
                  <div
                    className="wishlist-action"
                    onClick={() => {
                      handleWishlistDetail(item.wishlist_id);
                    }}
                  >
                    Details
                  </div>
                </td>
                <td>{item.create_time}</td>
                {props.isMyWishlist ? (
                  <td>
                    {item.can_delete ? (
                      <div
                        className="wishlist-action"
                        onClick={() => {
                          props.onDelete && props.onDelete(item.wishlist_id);
                        }}
                      >
                        Delete
                      </div>
                    ) : (
                      <div
                        className="wishlist-action"
                        onClick={() => {
                          props.onExist && props.onExist(item.wishlist_id);
                        }}
                      >
                        Exit
                      </div>
                    )}
                    {item.can_edit ? (
                      <div
                        className="wishlist-action"
                        onClick={() => {
                          props.onEdit && props.onEdit(item.wishlist_id);
                        }}
                      >
                        Edit
                      </div>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal
        onCancel={() => {
          setMovieList([]);
          setShowMovielist(false);
        }}
        visible={showMovielist}
        footer={null}
        width="800px"
      >
        <MovieList isWishlistDetail={true} movieList={movieList}></MovieList>
      </Modal>
    </div>
  );
}
