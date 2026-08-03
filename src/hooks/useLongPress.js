import { useState, useRef } from 'react';

export default function useLongPress(onLongPress) {
  const [action, setAction] = useState();

  const timerRef = useRef();
  const targetRef = useRef();

  function startPressTimer(target, id) {
    targetRef.current = { target, id };
    timerRef.current = setTimeout(() => {
      setAction('longpress');
      onLongPress && onLongPress(id);
    }, 500);
  }

  function handleOnClick(e) {
    if (targetRef.current && targetRef.current.target === e.target) {
      setAction('click');
    }
  }

  function handleOnMouseDown(e) {
    startPressTimer(e.target, e.currentTarget.getAttribute('id'));
  }

  function handleOnMouseUp() {
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart(e) {
    startPressTimer(e.target, e.currentTarget.getAttribute('id'));
  }

  function handleOnTouchEnd() {
    clearTimeout(timerRef.current);
  }

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
  };
}
