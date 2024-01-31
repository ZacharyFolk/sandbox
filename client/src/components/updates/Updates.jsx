import { useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';

export default function Updates() {
  const [content, setContent] = useState('');
  useEffect(() => {
    fetch('Changelog.md')
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <>
      <h2>Latest Updates</h2>
      <div className='changelog new-scroll'>
        <ReactMarkdown children={content} />
      </div>
    </>
  );
}
