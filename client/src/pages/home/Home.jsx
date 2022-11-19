import React from 'react';
import './home.css';
import Posts from '../../components/posts/Posts';
import Sidebar from '../../components/sidebar/Sidebar';
export default function Home() {
  return (
    <>
      <div class='container'>
        <Posts />
        <Sidebar />
      </div>
    </>
  );
}
