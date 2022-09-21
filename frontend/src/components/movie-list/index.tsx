import React, { useState } from 'react';

import './index.css';

import { MovieDetail } from '../movie-detail';
import { PICTURE_PREFIX } from '../../service';

interface MovieListProps {
  movieList: any[];
  isAdmin?: boolean;
  isWishlistDetail?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onAddWishlist?: (id: number) => void;
}

export default function MovieList(props: MovieListProps) {
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  const [movieData, setMovieData] = useState({});

  return (
    <div>
      <table className="admin-main">
        <thead>
          <tr className="admin-main-tr">
            <th></th>
            <th>Film</th>
            <th>Year</th>
            <th>Director</th>
            <th>Cast</th>
            <th>Genre</th>
            <th>Rating</th>
            <th>Detail</th>
            {!props.isWishlistDetail ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {props.movieList.map((item) => {
            return (
              <tr
                key={item.movie_id}
                className="admin-main-tr admin-main-tr-content"
                onClick={() => {
                  setShowMovieDetail(true);
                  setMovieData(item);
                }}
              >
                <td>
                  <img
                    className="admin-main-img"
                    src={`${PICTURE_PREFIX}/${item.picture}?t=${Date.now()}`}
                    alt=""
                  ></img>
                </td>
                <td>{item.movie_name}</td>
                <td>{item.production_year}</td>
                <td>{item.director}</td>
                <td>{item.cast_list}</td>
                <td>{item.genre_list}</td>
                <td>{item.rating}</td>
                <td className="admin-main-detail">
                  <div className="admin-main-detail__div">{item.synopsis}</div>
                </td>
                {props.isAdmin ? (
                  <td>
                    <div
                      className="admin-main-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onDelete && props.onDelete(item.movie_id);
                      }}
                    >
                      Delete
                    </div>
                    <div
                      className="admin-main-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onEdit && props.onEdit(item.movie_id);
                      }}
                    >
                      Edit
                    </div>
                  </td>
                ) : !props.isWishlistDetail ? (
                  <td>
                    <div
                      className="admin-main-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onAddWishlist &&
                          props.onAddWishlist(item.movie_id);
                      }}
                    >
                      Add to wishlist
                    </div>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
      <MovieDetail
        onCancel={() => {
          setShowMovieDetail(false);
        }}
        onAddWishlist={props.onAddWishlist}
        data={movieData}
        visible={showMovieDetail}
      ></MovieDetail>
    </div>
  );
}
