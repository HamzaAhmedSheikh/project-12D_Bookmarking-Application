import React from 'react';
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";




const BookMarksQuery = gql`{
  bookmark {
    url
  }
}`;

const AddBookMarkMutation = gql`
  mutation addBookmark($url: String!, $desc: String!) {
    addBookmark(url: $url, desc: $desc) {
      url
    }
  }
`

export default function Home() {
  const {loading, error, data } = useQuery(BookMarksQuery);
  const [addBookmark] = useMutation(AddBookMarkMutation);
  let textfield, desc;

  const addBookmarkSubmit = () => {
    addBookmark({
      variables: {
        url: textfield.value,
        desc: desc.value
      }
    })
    console.log('textfield ===>', textfield.value);
    console.log('Description  ===>', desc.value);
  }

  return (
    <div> 
      <div>
        <input type='text' placeholder="Enter bookmark URL" ref={node => textfield=node} />
        <input type="text" placeholder="Description " ref={node => desc=node}/>
        <button onClick={addBookmarkSubmit}> Add Bookmrk </button>
      </div>
      <p> { JSON.stringify(data) } </p> 
    </div>
  ) 
}