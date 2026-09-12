"use client";

export default function Error({ reset }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <h2>Something went wrong</h2>

        <p>
          Pixora AI couldn't load this page properly.
          Please try again.
        </p>

        <button
          onClick={() => reset()}
          style={{
            marginTop: "12px",
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}