import { React, useState, useEffect } from 'react';
import axios from 'axios';
const issuesUrl = 'https://api.github.com/repos/zacharyfolk/sandbox/issues';

function GitIssues() {
  const [issues, setIssues] = useState([]);

  const localissues = sessionStorage.getItem('latest-issues');
  const fetchIssues = async () => {
    if (!localissues) {
      const res = await axios.get(issuesUrl);
      const result = await res.data;

      console.log('REQUEST MADE TO GITHUB.API ISSUES');
      console.log(result);
      sessionStorage.setItem('latest-issues', JSON.stringify(result));
      setIssues(result);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Doing this so it can be used immediately after being set to localstorage from the initial fetch
  useEffect(() => {
    setIssues(JSON.parse(localissues));
  }, []);

  return (
    <>
      <h2>
        {' '}
        <i className='fab fa-github-alt'></i> To-Do List:
      </h2>
      {issues && <Issues issues={issues} />}
    </>
  );
}

function Issues({ issues }) {
  return (
    <div className='issue-box'>
      {issues.map((z, i) => (
        <Issue key={i} issue={z} />
      ))}
    </div>
  );
}

function Label({ label }) {
  console.log(label.color);
  return (
    <>
      <span className='label' style={{ color: `#${label.color}` }}>
        {label.name}
      </span>
      <span className='divider'> : </span>{' '}
    </>
  );
}
function Issue({ issue }) {
  let issue_link = issue.html_url;
  let issue_title = issue.title;
  let labelObj = issue.labels;

  console.log(labelObj);

  return (
    <div className='issue-container'>
      {labelObj.map((z, i) => {
        return <Label key={i} label={z} />;
      })}

      <a
        href={issue_link}
        className='issue-link'
        target={'_blank'}
        rel='noreferrer'
      >
        {issue_title}
      </a>
    </div>
  );
}

export default GitIssues;
