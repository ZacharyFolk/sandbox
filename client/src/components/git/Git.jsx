import { React, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

function Git() {
  const [commits, setCommits] = useState([]);

  const url = 'http://localhost:9999/github_api/commit/ZacharyFolk/sandbox';
  const localcommits = sessionStorage.getItem('latest-commits');
  const fetchCommits = async () => {
    if (!localcommits) {
      const res = await axiosInstance.get(url);
      const result = await res.data;
      console.log('REQUEST MADE TO GITHUB.API');
      sessionStorage.setItem('latest-commits', JSON.stringify(result));
      setCommits(result);
      // return (commits = result); // this works to use state immediately
    }
  };

  useEffect(() => {
    fetchCommits();
  }, []);
  // Doing this so it can be used immediately after being set to localstorage from the initial fetch
  useEffect(() => {
    setCommits(JSON.parse(localcommits));
  }, []);
  return (
    <>
      <div className='container'>
        {commits && <Commits commits={commits} />}
      </div>
    </>
  );
}

function Commits({ commits }) {
  console.log(commits);
  return (
    <div className='commit-box'>
      {commits.map((c, i) => (
        <Commit key={i} commit={c} />
      ))}
    </div>
  );
}
function Commit({ commit }) {
  let commit_link = commit.html_url;
  let commit_date = commit.commit.committer.date;
  let commit_msg = commit.commit.message;
  let commit_sha = commit.sha;
  const emoji = require('emoji-dictionary');
  const reg = /:([a-zA-Z]+):/g;
  commit_date = new Date(commit_date);
  let time_passed = moment(commit_date, 'YYYYMMDD').fromNow();
  // TODO :This is off by a few hours for some reason

  const replacer = function (match) {
    let emo = match.split(':').join('');
    return emoji.getUnicode(emo);
  };

  // commit_date = new Date(commit_date).toLocaleDateString('en-US', {
  //   month: 'long',
  //   day: '2-digit',
  //   year: 'numeric',
  // });

  commit_sha = commit_sha.substring(0, 7);

  let cm = commit_msg.replace(reg, replacer);
  if (cm.length > 120) {
    cm = cm.substring(0, 120) + '...';
  }

  return (
    <div className='commit-container'>
      <a
        className='commit-sha'
        href={commit_link}
        rel='noreferrer'
        target='_blank'
      >
        {commit_sha}
      </a>
      <span className='commit-msg'>{cm} </span>
      <span className='time'>{time_passed}</span>
    </div>
  );
}

export default Git;
