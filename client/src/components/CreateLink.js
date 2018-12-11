import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { FEED_QUERY } from "./LinkList";

const POST_MUTATION = gql`
  mutation PostLinkMutation($description: String!, $url: String!) {
    postLink(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

class CreateLink extends Component {
  state = {
    description: "",
    url: "",
  };

  render() {
    const { description, url } = this.state;
    return (
      <div>
        <div>
          <input
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <Mutation
          mutation={POST_MUTATION}
          variables={{ description, url }}
          onCompleted={() => this.props.history.push("/")}
          update={(store, { data: { post } }) => {
            const data = store.readQuery({ query: FEED_QUERY });
            data.feed.links.unshift(post);
            store.writeQuery({
              query: FEED_QUERY,
              data,
            });
          }}
        >
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </div>
    );
  }
}

export default CreateLink;
