import React, { useEffect, useState } from 'react';

import { userSearchByID } from '../../service';

import { MovieDetail } from '../../components/movie-detail';

export default function Tourists() {
  const [data, setData] = useState({});
  useEffect(() => {
    const id = window.location.search.slice(1).split('=')[1];
    userSearchByID(id).then((res) => {
      if (res.data.code === 0) {
        setData(res.data.movie);
      }
    });
  }, []);
  return (
    <div>
      <MovieDetail
        isTourists={true}
        onCancel={() => {}}
        data={data}
        visible={true}
      ></MovieDetail>
    </div>
  );
}
