import { SocialIcon } from 'react-social-icons';

const Social = () => {
  return (
    <div className='social-container'>
      <SocialIcon
        title='Zachary Folk on LinkedIn'
        bgColor='#5bf870'
        target={'_blank'}
        url='https://www.linkedin.com/in/zacharyfolk/'
      />
      <SocialIcon
        title='My Instagram'
        bgColor='#5bf870'
        target={'_blank'}
        url='https://www.instagram.com/zachary_folk/'
      />
      <SocialIcon
        title='My Github account'
        bgColor='#5bf870'
        target={'_blank'}
        url='https://github.com/ZacharyFolk'
      />
      <SocialIcon
        title='Folk Photography on Facebook'
        target={'_blank'}
        bgColor='#5bf870'
        url='https://www.facebook.com/zacharyfolkphotography/'
      />
      <SocialIcon
        title='My very unused twitter account'
        bgColor='#5bf870'
        target={'_blank'}
        url='https://twitter.com/FolkPhotograph1'
      />
      <SocialIcon
        title='Before A.I. there was StackOverflow'
        bgColor='#5bf870'
        target={'_blank'}
        url='https://stackoverflow.com/users/82330/zac'
      />
    </div>
  );
};
export default Social;
