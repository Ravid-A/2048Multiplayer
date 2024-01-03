import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="emoji">😢</div>
      <h1>404 Not Found</h1>
      <p>Oops! The page you're looking for might be in another castle.</p>
      <p>
        Go back to <Link href="/">Home</Link>.
      </p>

      <style jsx>{`
        .container {
          text-align: center;
          font-family: "Arial", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }

        .emoji {
          font-size: 4em;
        }

        h1 {
          color: #333;
        }

        p {
          color: #555;
        }

        a {
          color: #007bff;
          text-decoration: none;
          font-weight: bold;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
