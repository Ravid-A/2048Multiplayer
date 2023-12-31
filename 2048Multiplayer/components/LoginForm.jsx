export default function LoginForm({ handleSubmit, user, setUser }) {
  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value });
  };

  return (
    <div className="login">
      <div className="login__container">
        {/* <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div> */}
        <div className="login__form">
          <form onSubmit={handleSubmit}>
            <input
              id="identifier"
              type="text"
              placeholder="Username/Email"
              value={user.identifier}
              onChange={handleChange}
            />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
