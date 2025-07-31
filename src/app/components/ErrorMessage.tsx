"use client";
export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-100 text-red-800 p-4 rounded-lg my-4">
      <p>{message}</p>
    </div>
  );
}
