import { React, useState, useEffect } from 'react';
import axios from 'axios';

function Git() {
  const [commits, setCommits] = useState([]);

  const url = 'http://localhost:9999/github_api/commit/ZacharyFolk/sandbox';
  const localcommits = sessionStorage.getItem('latest-commits');

  useEffect(() => {
    const fetchCommits = async () => {
      if (!localcommits) {
        const res = await axios.get(url);
        const result = await res.data;
        console.log('REQUEST MADE TO GITHUB.API');
        sessionStorage.setItem('latest-commits', JSON.stringify(result));
        setCommits(result);
        return (commits = result); // this works to use state immediately?
      }

      // storing commits to stop spamming the API

      setCommits(JSON.parse(localcommits));
      // TODO: Bug when commits not set, requires refresh
      //   localcommits ? console.log('yes') : console.log('no');
    };
    fetchCommits();
  }, []);

  return (
    <>
      <div className='container'>
        <Commits commits={commits} />
      </div>
    </>
  );
}

function Commits({ commits }) {
  return (
    <div className='commit'>
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

  const replacer = function (match) {
    let emo = match.split(':').join('');
    return emoji.getUnicode(emo);
  };

  commit_date = new Date(commit_date).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

  commit_sha = commit_sha.substring(0, 7);
  let cm = commit_msg.replace(reg, replacer);

  return (
    <div className='commit-container'>
      <a href={commit_link} rel='noreferrer' target='_blank'>
        {commit_sha}
      </a>
      <span>{cm} </span>
      <span>{commit_date}</span>
    </div>
  );
}

export default Git;
