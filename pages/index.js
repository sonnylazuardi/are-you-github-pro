import fetch from 'isomorphic-fetch';
import Router from 'next/router';

class Index extends React.Component {
  state = {
    username: this.props.user,
    loading: false,
  };
  onSubmit(e) {
    const { username } = this.state;
    e.preventDefault();
    this.setState({ loading: true });
    Router.push(`/index?username=${username}`);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.result != this.props.result) {
      this.setState({ loading: false });
    }
  }
  renderResult() {
    const { user, isGithubPro } = this.props;
    if (!user) return null;
    return (
      <div>
        {user} : {isGithubPro ? 'YES' : 'NO'}
      </div>
    );
  }
  render() {
    const { username, loading } = this.state;
    return (
      <div>
        <h1>Are you github pro?</h1>
        {loading ? 'Loading...' : null}
        {this.renderResult()}
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            type="text"
            placeholder="Github username"
            value={username}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <button type="submit">Check</button>
        </form>
      </div>
    );
  }
}

Index.getInitialProps = async function({ query, req }) {
  const { username } = query;
  const baseUrl = req ? `https://${req.get('Host')}` : '';
  if (username == '') return { isGithubPro: false, user: null };
  const gdomQuery = `
    {
      page(url:"https://github.com/${username}") {
        pro: query(selector:".label.bg-purple.text-uppercase") {
          text: text(selector:"")
        }
      }
    }
  `;
  console.log('BASEURL', baseUrl);
  const res = await fetch(`${baseUrl}/gdom`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query: gdomQuery }),
  });
  const result = await res.json();
  return { isGithubPro: result.data.page.pro.length > 0, user: username, result };
};

export default Index;
