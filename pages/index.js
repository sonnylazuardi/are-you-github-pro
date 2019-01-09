import fetch from 'isomorphic-fetch';
import Router from 'next/router';
import Overdrive from 'react-overdrive';
import Head from 'next/head';
import { SyncLoader } from 'react-spinners';
import { timingSafeEqual } from 'crypto';

class Index extends React.Component {
  state = {
    username: this.props.user,
    loading: false,
    currentResult: null,
    currentUser: null,
  };
  onSubmit(e) {
    const { username } = this.state;
    this.setState({ loading: true });
    Router.push(`/index?username=${username}`);
    e.preventDefault();
  }
  static getDerivedStateFromProps(props, state) {
    if (props.result !== state.currentResult) {
      return {
        currentResult: props.result,
        loading: false,
      };
    }
    if (props.user !== state.currentUser) {
      return {
        currentUser: props.user,
        currentResult: !props.user ? null : props.currentResult,
        loading: false,
      };
    }
    return null;
  }

  render() {
    const { data, isGithubPro } = this.props;
    const { username, loading, currentResult } = this.state;
    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          <meta charSet="utf-8" />
        </Head>

        <div className="container">
          <h1 className="title">Are you ★ github pro?</h1>

          <form onSubmit={e => this.onSubmit(e)} className="form">
            {(() => {
              if (!currentResult) {
                return (
                  <Overdrive id="badge" duration={2000} animationDelay={1}>
                    <div>
                      <div className="badge-off" />
                    </div>
                  </Overdrive>
                );
              } else {
                return (
                  <Overdrive id="badge" duration={2000} animationDelay={1}>
                    <div>
                      <div className={'badge-on ' + (isGithubPro ? 'badge-green' : '')}>
                        {isGithubPro ? 'YES' : 'NO'}
                      </div>
                    </div>
                  </Overdrive>
                );
              }
            })()}
            {(() => {
              if (!currentResult) {
                return (
                  <Overdrive id="github-pro-status" duration={500}>
                    <div>
                      <div className="input-small">
                        <input
                          type="text"
                          className="input"
                          placeholder="Type username..."
                          value={username}
                          onChange={e => this.setState({ username: e.target.value })}
                        />
                      </div>
                    </div>
                  </Overdrive>
                );
              } else {
                return (
                  <Overdrive id="github-pro-status" duration={500}>
                    <div>
                      <div className="input-large">
                        <img src={data.image[0].source.replace('s=460', 's=150')} className="display-picture" />
                        <div className="profile-title">{data.name}</div>
                        <div className="profile-country">{data.country}</div>
                      </div>
                    </div>
                  </Overdrive>
                );
              }
            })()}
            {!currentResult ? (
              <button className="check-button" type="submit">
                {loading ? <SyncLoader size={6} margin={'2px'} color={'#636771'} /> : 'Check'}
              </button>
            ) : (
              <button
                className="check-button"
                type="button"
                onClick={() => {
                  this.setState({ username: '' });
                  Router.push(`/index?username=`);
                }}
              >
                Check Again
              </button>
            )}
          </form>
        </div>
        <style jsx global>{`
          @font-face {
            font-family: SF Pro Display Bold;
            src: url('/static/sf-pro-display-bold.644563f4.otf') format('opentype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: SF Pro Display Medium;
            src: url('/static/sf-pro-display-medium.51fd7406.otf') format('opentype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          .badge-green {
            background: #27ae60 !important;
          }
          .badge-off {
            opacity: 0;
            position: absolute;
            right: 0;
            top: 100px;
            width: 80px;
            height: 40px;
            background: #636771;
            border-radius: 10px;
            color: white;
            justify-content: center;
            align-items: center;
            font-family: SF Pro Display Bold, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
              Helvetica Neue, sans-serif;
          }
          .badge-on {
            opacity: 1;
            position: absolute;
            right: 0;
            top: -80px;
            width: 80px;
            height: 40px;
            display: flex;
            background: #636771;
            border-radius: 10px;
            color: white;
            justify-content: center;
            align-items: center;
            font-family: SF Pro Display Bold, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
              Helvetica Neue, sans-serif;
          }
          .profile-title {
            margin-top: 60px;
            text-align: center;
            font-size: 20px;
            margin-bottom: 5px;
          }
          .profile-country {
            font-size: 14px;
            text-align: center;
            color: #636771;
            font-family: SF Pro Display Medium, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
              Helvetica Neue, sans-serif;
          }
          .display-picture {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            position: absolute;
            top: -40px;
            left: 0;
            right: 0;
            margin: 0 auto;
            box-shadow: 0px 10px 30px 5px #00000011;
          }
          .form {
            display: flex;
            flex-direction: column;
            flex: 1;
            position: relative;
            font-family: SF Pro Display Bold, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
              Helvetica Neue, sans-serif;
          }
          .input {
            height: 48px;
            flex: 1;
            display: flex;
            border-radius: 10px;
            border: none;
            padding: 0px 16px;
            font-size: 14px;
            font-family: SF Pro Display Medium, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
              Helvetica Neue, sans-serif;
          }
          .input-large {
            margin-top: 40px;
            box-shadow: 0px 10px 30px 5px #00000011;
            margin-bottom: 16px;
            background: #fff;
            border-radius: 10px;
            height: 150px;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .input-small {
            margin-top: 0px;
            box-shadow: 0px 10px 30px 5px #00000011;
            margin-bottom: 16px;
            background: #fff;
            height: 48px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
          }
          .check-button {
            cursor: pointer;
            border: 1px solid #636771;
            background: transparent;
            box-shadow: 0px 10px 30px 5px #00000011;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 48px;
            border-radius: 10px;
            font-size: 18px;
            color: #636771;
            font-family: SF Pro Display Bold, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
              Helvetica Neue, sans-serif;
            transition: all 0.2s ease-in-out;
          }
          .check-button:hover {
            transform: scale(1.05);
          }
          .title {
            font-size: 36px;
            max-width: 200px;
            color: #636771;
            font-family: -apple-system, BlinkMacSystemFont, SF Pro Display Bold, Segoe UI, Roboto, Oxygen, Ubuntu,
              Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          }
          body {
            background: #f7f7f7f7;
          }
          .container {
            padding-top: 40px;
            padding-right: 15px;
            padding-left: 15px;
            margin-right: auto;
            margin-left: auto;
          }
          @media (min-width: 480px) {
            .container {
              width: 320px;
            }
          }
          @media (min-width: 992px) {
            .container {
              width: 320px;
            }
          }
          @media (min-width: 1200px) {
            .container {
              width: 320px;
            }
          }
          .small {
            padding: 16px;
            background-color: #fff;
            border-radius: 10px;
            height: 10px;
            box-shadow: 0px 10px 30px 5px #00000011;
          }
          .big {
            padding: 16px;
            background-color: #fff;
            border-radius: 10px;
            height: 100px;
            box-shadow: 0px 10px 30px 5px #00000011;
          }
        `}</style>
      </div>
    );
  }
}

Index.getInitialProps = async function({ query, req }) {
  const { username } = query;
  const baseUrl = req ? `http://${req.get('Host')}` : '';
  if (!username) return { isGithubPro: false, user: null, data: null };
  const gdomQuery = `
    {
      page(url:"https://github.com/${username}") {
        name: text(selector: ".p-name.vcard-fullname.d-block.overflow-hidden")
        image: query(selector: ".avatar.width-full.rounded-2") {
          source: attr(name: "src")
        }
        country: text(selector: ".p-label")
        pro: text(selector: ".label.bg-purple.text-uppercase")
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
  return { isGithubPro: result.data.page.pro != '', data: result.data.page, user: username, result };
};

export default Index;
