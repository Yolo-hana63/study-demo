import { Button, Input } from "antd";
import { useEffect, useState } from "react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (countdown > 1) {
        setCountdown((pre) => pre - 1);
      } else {
        setIsSending(false);
      }
    }, 1000);
  }, [countdown]);

  // 注意一下卸载执行时机：
  // useEffect存在依赖项的时候，依赖项发生改变了才会执行上一个return的函数，否则会等到组件卸载的时候才执行
  // useEffect(() => {
  //   let timer = setInterval(() => {
  //     if (countdown > 1) {
  //       setCountdown((pre) => pre - 1);
  //     } else {
  //       setIsSending(false);
  //       clearInterval(timer);
  //     }
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, [countdown]);

  const sendCode = () => {
    setIsSending(true);
    setCountdown(5);
  };

  const handleLogin = () => {};
  return (
    <div>
      <div>
        <div>手机号：</div>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        ></Input>
      </div>
      <div>
        <div>验证码</div>
        <Input value={code} onChange={(e) => setCode(e.target.value)}></Input>
        <Button onClick={sendCode} disabled={isSending}>
          {isSending ? countdown : "获取验证码"}
        </Button>
      </div>
      <Button onClick={handleLogin}>登录</Button>
    </div>
  );
};

export default Login;
