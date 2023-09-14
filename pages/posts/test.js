import Layout from "../../components/layout";

export async function getStaticProps() {
    // Instead of the file system,
    // fetch post data from an external API endpoint
    const res = await fetch("http://localhost:8000/ifm/api/ifm");
    const data = await res.json();
    return {
      props: {
        data: data,
        done: true,
      }
    }
}
import React, { useState } from "react";
import { useRouter } from "next/router"; // 導入 useRouter

export default function Ifm({ data, done }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const router = useRouter(); // 初始化 useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 驗證電子郵件地址格式
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("請輸入有效的電子郵件地址！");
      return;
    }

    // 清除錯誤消息
    setErrorMessage("");

    // 如果格式驗證通過，執行表單提交操作
    try {
      const response = await fetch("http://localhost:8000/reg/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // 提交成功，執行你的成功操作
        router.push("http://localhost:8000/reg/uchi"); // 成功後跳轉到 "/success" 頁面
      } else {
        // 提交失敗，處理錯誤情況
        // router.push("/error"); // 失敗後跳轉到 "/error" 頁面
        const errorData = await response.json();
        setErrorMessage(errorData.message); // 假設後端返回了一個包含錯誤消息的 JSON
        console.log(data)
      }
    } catch (error) {
      // 處理錯誤情況
      console.log(error)
    }
  };

  return (
    <div>
      <form action="http://localhost:8000/reg/login" method="POST" onSubmit={handleSubmit}>
        <h1>登入</h1>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">點擊登入</button>
      </form>
      
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
}