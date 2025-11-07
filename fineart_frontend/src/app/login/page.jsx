'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('로그인 API 연결 예정입니다.');
  };

  return (
    <div className="screen-padding section mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">FineArt Studio</p>
        <h1 className="text-3xl font-semibold">로그인</h1>
        <p className="text-sm text-neutral-600">관리자 또는 큐레이터 계정으로 접속하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-neutral-100 bg-white px-6 py-8 shadow-sm">
        <label className="block text-sm font-medium text-neutral-700">
          이메일
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-neutral-700">
          비밀번호
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </label>
        <button type="submit" className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white">
          로그인
        </button>
      </form>
    </div>
  );
}
