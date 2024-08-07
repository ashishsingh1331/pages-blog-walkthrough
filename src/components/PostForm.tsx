import { FormEvent, useRef, useState } from "react";
import { FormGroup } from "./FormGroup";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  post?: { id: number; title: string; body: string; userId: number };
  users: { id: number; name: string }[];
};

export function PostForm({ post, users }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const userIdRef = useRef<HTMLSelectElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [errors, setErrors] = useState<{
    title?: string;
    body?: string;
    userId?: string;
  }>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titleRef.current?.value,
        userId: Number(userIdRef.current?.value),
        body: bodyRef.current?.value,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((data) => Promise.reject(data));
      })
      .then((post) => {
        router.push(`/posts/${post.id}`);
      })
      .catch((errors) => {
        setErrors(errors);
      });
  }
  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <FormGroup errorMessage={errors.title}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={post?.title}
            ref={titleRef}
          />
        </FormGroup>
        <FormGroup errorMessage={errors.userId}>
          <label htmlFor="userId">Author</label>
          <select
            required
            name="userId"
            id="userId"
            defaultValue={post?.userId}
            ref={userIdRef}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup errorMessage={errors.body}>
          <label htmlFor="body">Body</label>
          <textarea
            required
            name="body"
            id="body"
            defaultValue={post?.body}
            ref={bodyRef}
          />
        </FormGroup>
      </div>
      <div className="form-row form-btn-row">
        <Link
          className="btn btn-outline"
          href={post ? `/posts/${post.id}` : "/posts"}
        >
          Cancel
        </Link>
        <button className="btn">Save</button>
      </div>
    </form>
  );
}
