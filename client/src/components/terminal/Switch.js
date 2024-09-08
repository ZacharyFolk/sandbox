import { useEffect } from 'react';
import Cookies from 'js-cookie';

const SwitchComponent = ({ power, setPower }) => {
  const switchClick = new Audio('./sounds/sound_click.mp3');
  switchClick.volume = 0.1;

  const handleToggle = () => {
    switchClick.play();

    setPower((prevPower) => !prevPower);
  };

  useEffect(() => {
    Cookies.set('power', power);
  }, [power]);

  return (
    <div className={`switch ${power ? 'on' : 'off'}`} onClick={handleToggle}>
      <input className="cb" type="checkbox" checked={power} readOnly />
      <div className="toggle">
        <div className="left">off</div>
        <div className="right">on</div>
      </div>
    </div>
  );
};

export default SwitchComponent;
