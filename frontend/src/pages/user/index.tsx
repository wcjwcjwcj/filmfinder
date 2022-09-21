import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Popover, Empty, Modal, Select, message } from 'antd';
import './index.css';

import logo from '../../images/logo.jpg';
import { StateType, showSignOut, clearUserMsg } from '../../store';
import {
  userSearch,
  userSearchWishlist,
  signout,
  userDeleteWishtlist,
  userAddMovieToWishtlist,
  userExistWishlist,
} from '../../service';

import WishlistModal from './components/wishlist-modal';
import MovieList from '../../components/movie-list';
import Wishlist from '../../components/wish-list';

export default function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector<StateType, string>((state) => state.userName);
  const isAdmin = useSelector<StateType, boolean>((state) => state.isAdmin);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const tooglePopover = useCallback(() => {
    if (username === 'Not logged in') return;
    setSignOutVisible(!signOutVisible);
  }, [username, signOutVisible]);

  const [pageType, setPageType] = useState<'discover' | 'wishlist'>('discover');
  const [searchType, setSearchType] = useState<'film' | 'wishlist'>('film');
  const [keyword, setKeyword] = useState('');
  const toggleSearchType = (type: 'film' | 'wishlist') => {
    setSearchType(type);
  };

  const [movieList, setMovieList] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const onSearchHandler = () => {
    if (searchType === 'film') {
      userSearch(keyword).then((res) => {
        setMovieList(res.data.movie_list);
      });
    } else {
      userSearchWishlist(keyword).then((res) => {
        setWishlist(res.data.data);
      });
    }
  };

  useEffect(() => {
    onSearchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType]);

  const [myWishlist, setMyWishlist] = useState<any[]>([]);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [wishlistEditID, setWishlistEditID] = useState<number>();
  const [wishlistInitialData, setWishlistInitialData] = useState<any>({});
  const [wishlistEditType, setWishlistEditType] = useState<'new' | 'edit'>(
    'new',
  );
  const getMyWishlist = () => {
    userSearchWishlist('', true).then((res) => {
      setMyWishlist(
        res.data.data.filter((item: any) => item.can_delete || item.can_edit),
      );
    });
  };
  const handleEditWishlist = (id: number) => {
    setWishlistEditID(id);
    setShowWishlistModal(true);
    setWishlistEditType('edit');
    for (let i = 0; i < myWishlist.length; i++) {
      if (myWishlist[i].wishlist_id === id) {
        setWishlistInitialData(myWishlist[i]);
        break;
      }
    }
  };
  const handleDeleteWishlist = (id: number) => {
    userDeleteWishtlist(id).then((res) => {
      if (res.data.code === 0) {
        getMyWishlist();
      }
    });
  };
  const handleExistWishlist = (id: number) => {
    userExistWishlist(id).then((res) => {
      if (res.data.code === 0) {
        getMyWishlist();
      }
    });
  };

  const [showAddToWishlist, setShowAddToWishlist] = useState(false);
  const [addToWishlistID, setAddToWishlistID] = useState<number>();
  const [addTargetID, setAddTargetID] = useState<number>();
  const handleClickAddMovieToWishlist = (id: number) => {
    setShowAddToWishlist(true);
    setAddToWishlistID(id);
    getMyWishlist();
  };
  const addMovieToWishlist = () => {
    if (
      typeof addTargetID !== 'number' ||
      typeof addToWishlistID !== 'number'
    ) {
      message.error('Please choose an wishlist');
      return;
    }
    userAddMovieToWishtlist(addTargetID, addToWishlistID).then((res) => {
      if (res.data.code === 0) {
        setAddToWishlistID(undefined);
        setAddTargetID(undefined);
        setShowAddToWishlist(false);
      }
    });
    console.log(addToWishlistID, addTargetID);
  };

  useEffect(() => {
    if (pageType === 'wishlist') {
      getMyWishlist();
    }
  }, [pageType]);

  return (
    <div>
      {/* header */}
      <div className="header">
        <img className="header-logo" src={logo} alt=""></img>
        <div
          className={`header-discover ${
            pageType === 'discover' ? 'header--selected' : ''
          }`}
          onClick={() => setPageType('discover')}
        >
          DISCOVER
        </div>
        <div
          className={`header-wish ${
            pageType === 'wishlist' ? 'header--selected' : ''
          }`}
          onClick={() => setPageType('wishlist')}
        >
          MY WISHLIST
        </div>
        <Popover
          visible={signOutVisible}
          content={
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              onClick={() => {
                signout().then((res) => {
                  if (res.data.code === 0) {
                    dispatch(clearUserMsg());
                    dispatch(showSignOut());
                    setSignOutVisible(false);
                  }
                });
              }}
            >
              SignOut
            </a>
          }
        >
          <div onClick={tooglePopover} className="header-avator">
            {username}
          </div>
        </Popover>
      </div>

      {pageType === 'discover' ? (
        <>
          {/* discover */}
          {/* search */}
          <div className="search">
            {isAdmin && (
              <div
                onClick={() => {
                  navigate('/admin');
                }}
                className="search-admin"
              >
                Enter Management System
              </div>
            )}
            <div className="search-main">
              <div>
                <span
                  onClick={() => toggleSearchType('film')}
                  className={
                    searchType === 'film'
                      ? 'search-menu search-menu--selected'
                      : 'search-menu'
                  }
                >
                  Film
                </span>
                <span
                  onClick={() => toggleSearchType('wishlist')}
                  className={
                    searchType === 'wishlist'
                      ? 'search-menu search-menu--selected'
                      : 'search-menu'
                  }
                >
                  Wishlist
                </span>
              </div>
              <div className="search-input-wrap">
                <input
                  value={keyword}
                  placeholder={`Enter ${
                    searchType === 'film' ? 'movies' : 'wishlist'
                  } keywords.`}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                  }}
                  className="search-input"
                ></input>
                <div
                  onClick={onSearchHandler}
                  className="search-input-icon"
                ></div>
              </div>
            </div>
          </div>

          {/* movie list */}
          {searchType === 'film' && movieList?.length > 0 ? (
            <MovieList
              onAddWishlist={handleClickAddMovieToWishlist}
              movieList={movieList}
            ></MovieList>
          ) : null}
          {searchType === 'film' && movieList?.length === 0 ? (
            <Empty style={{ marginTop: '50px' }} description="No film found" />
          ) : null}
          {/* wish list */}
          {searchType === 'wishlist' && wishlist?.length > 0 ? (
            <Wishlist wishlist={wishlist}></Wishlist>
          ) : null}
          {searchType === 'wishlist' && wishlist?.length === 0 ? (
            <Empty
              style={{ marginTop: '50px' }}
              description="No wishlist found"
            />
          ) : null}
        </>
      ) : (
        <>
          {/* my wishlist */}
          <div className="wishlist-new-wrap">
            <div
              onClick={() => {
                setWishlistEditType('new');
                setShowWishlistModal(true);
              }}
              className="wishlist-new"
            >
              New Wishlist
            </div>
          </div>
          {myWishlist?.length > 0 ? (
            <Wishlist
              onEdit={handleEditWishlist}
              onDelete={handleDeleteWishlist}
              onExist={handleExistWishlist}
              wishlist={myWishlist}
              isMyWishlist={true}
            ></Wishlist>
          ) : (
            <Empty
              style={{ marginTop: '50px' }}
              description="You don't have a wish list"
            />
          )}
        </>
      )}
      <WishlistModal
        visible={showWishlistModal}
        type={wishlistEditType}
        onHide={() => {
          setShowWishlistModal(false);
          getMyWishlist();
        }}
        editingID={wishlistEditID}
        initialData={wishlistInitialData}
      ></WishlistModal>
      <Modal
        onOk={addMovieToWishlist}
        visible={showAddToWishlist}
        onCancel={() => {
          setAddToWishlistID(undefined);
          setAddTargetID(undefined);
          setShowAddToWishlist(false);
        }}
      >
        <Select
          value={addTargetID}
          onChange={(item) => {
            setAddTargetID(item);
          }}
          placeholder="Please select wishlist"
          style={{ width: '100%', marginTop: '20px' }}
        >
          {myWishlist.map((item: any) => {
            return (
              <Select.Option value={item.wishlist_id} key={item.wishlist_id}>
                {item.wishlist_name}
              </Select.Option>
            );
          })}
        </Select>
      </Modal>
    </div>
  );
}
