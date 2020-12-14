import React, { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Formik, Form, Field } from "formik";
import { Grid } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import "./style.css";



const BookMarksQuery = gql`{
  bookmark {
    id
    url
    desc
  }
}`;

const AddBookMarkMutation = gql`
  mutation addBookmark($url: String!, $desc: String!) {
    addBookmark(url: $url, desc: $desc) {
      url
    }
  }
`;

const deleteBookmark = gql`
  mutation delBookmark($id: ID!) {
    delBookmark(id: $id) {
      url
      desc
    }
  }
`


export default function Home() {
  // const [title, setTitle] = useState("");
  // const [siteUrl, setSiteURl] = useState("");
  const { loading, error, data } = useQuery(BookMarksQuery);
  const [addBookmark] = useMutation(AddBookMarkMutation);
  const [delBook] = useMutation(deleteBookmark)
  let textfield, desc;

  const handleDelete = event => {
    console.log(event.currentTarget);
    delBook({
      variables: {
        id: event.currentTarget.value,
      },
      refetchQueries: [{ query: BookMarksQuery }],
    })
  }
  if (error) {
    return <h4>error</h4>
  }


  return (
    <div>
      <div>
        <div className="head">
          <h2>Bookmarking App</h2>
        </div>
 
        <Formik
          onSubmit={(value, actions) => {
            addBookmark({
              variables: {
                url: value.url,
                desc: value.desc,
               },
                refetchQueries: [{query:BookMarksQuery}],
             })
  
            actions.resetForm({
              values: {
                url: "",
                desc: "",              
              },
            })
           }}
  
           initialValues={{
            url: "",
            desc: "",          
          }}
         >          
          {formik => (
            <Form onSubmit={formik.handleSubmit}>
              <div className="input-main">
                <div className="input-div">
                  <Field type="text" name="url" id="url" placeholder="link" />
                  <Field
                    type="description"
                    name="desc"
                    id="desc"
                    placeholder="description"
                  />

                  <button type="submit"> Add Bookmark </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>          
       </div>
      {/* <p> { JSON.stringify(data) } </p>  */}

      <h2 className="bookmark-list"> Bookmark List </h2>
      <div className="data-container">
        <Grid className="card-container">
          {data && data.bookmark.map((d) =>
            <Grid key={d.id}>
              <div className="dataList">
                <div className="listBtn">
                  <h3> {d.desc} </h3>
                  <Delete className="deletebtn" onClick={handleDelete} value={d.id}/>
                </div>

                <div>
                 <a href={d.url} className="title" target="_blank" rel="noreferrer"> view my bookmark.  </a>
                </div>
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  )
}