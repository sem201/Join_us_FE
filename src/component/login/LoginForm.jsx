import React, { useState } from "react";
import Cookies from "js-cookie";
import * as S from "./styled";
import Button from "../common/Button";
import eye from "../../assets/img/password_eye.svg";
import eye_close from "../../assets/img/password_eye_close.svg";
import { Link } from "react-router-dom";
import apiCall from "../../api/Api";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const Login = async () => {
    const data = {
      userid: userid,
      password: password,
    };
    try {
      setLoading(true);
      const response = await apiCall("users/login/", "post", data, null);
      const token = response.data.token;

      if (token) {
        Cookies.set("access_token", token, {
          path: "/",
          secure: true,
          sameSite: "None",
        });
        setLoading(false);
        navigate("/us");
      }
      if (response.data.errors) {
        setLoading(false);
        alert(response.data.message + "아이디 혹은 비밀번호를 확인해주세요!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div>{loading ? <Loading /> : null}</div>
      <S.LoginFormContainer>
        <S.LoginInput
          placeholder="아이디를 입력해주세요"
          type="text"
          onChange={(e) => setUserid(e.target.value)}
          value={userid}
        ></S.LoginInput>
        <S.PasswordWrapper>
          <S.LoginInput
            placeholder="비밀번호를 입력해주세요"
            type={passwordVisible ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></S.LoginInput>
          <S.EyeContainer>
            <S.EyeImg
              src={passwordVisible ? eye : eye_close}
              onClick={togglePasswordVisibility}
            ></S.EyeImg>
          </S.EyeContainer>
        </S.PasswordWrapper>
      </S.LoginFormContainer>
      <S.ButtonContainer>
        <Button bgColor="#417E59" onClick={Login}>
          로그인
        </Button>
        <Link to="/signup">
          <Button bgColor="#1A1E1B">회원가입</Button>
        </Link>
      </S.ButtonContainer>
    </>
  );
};

export default LoginForm;
