import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

import { adminSearch, adminDelete } from '../../service';

import MovieModal from './components/movie-modal';
import MovieList from '../../components/movie-list';

export default function Admin() {
  const [keywrod, setKeyword] = useState('');
  const [movieList, setMovieList] = useState<any[]>([]);
  const navigate = useNavigate();

  const searchByKeyword = () => {
    adminSearch(keywrod)
      .then((res) => {
        if (res.data.movie_list) {
          setMovieList(res.data.movie_list);
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    searchByKeyword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'new' | 'edit'>('new');
  const [editingID, setEditingID] = useState<number>();
  const [initialData, setInialData] = useState();
  const onHide = () => {
    setShowModal(false);
    searchByKeyword();
  };
  const handleNewMovie = () => {
    setShowModal(true);
    setModalType('new');
  };
  const handleDelete = (id: number) => {
    adminDelete(id).then((res) => {
      searchByKeyword();
    });
  };
  const handleEdit = (id: number) => {
    setShowModal(true);
    setModalType('edit');
    setEditingID(id);
    for (let i = 0; i < movieList.length; i++) {
      if (movieList[i].movie_id === id) {
        const initialData = {
          ...movieList[i],
        };
        initialData.genre_list = initialData.genre_list.split('/');
        setInialData(initialData);
        break;
      }
    }
  };

  return (
    <div>
      <div className="admin-top">
        <div>
          Hi, Administrator.
          <div
            onClick={() => {
              navigate('/user');
            }}
            className="admin-top-exit"
          ></div>
        </div>
        <div className="admin-top-form">
          <input
            onChange={(e) => setKeyword(e.target.value)}
            className="admin-top-input"
          ></input>
          <div onClick={searchByKeyword} className="admin-top-btn"></div>
          <div onClick={handleNewMovie} className="admin-top-new">
            New
          </div>
        </div>
      </div>
      <MovieList
        onDelete={handleDelete}
        onEdit={handleEdit}
        movieList={movieList}
        isAdmin={true}
      ></MovieList>
      <MovieModal
        visible={showModal}
        type={modalType}
        onHide={onHide}
        editingID={editingID}
        initialData={initialData}
      ></MovieModal>
    </div>
  );
}
