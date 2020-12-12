import React from 'react';
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
`

export default function Home() {
  const {loading, error, data } = useQuery(BookMarksQuery);
  const [addBookmark] = useMutation(AddBookMarkMutation);
  let textfield, desc;

  // const addBookmarkSubmit = () => {
  //   addBookmark({
  //     variables: {
  //       url: textfield.value,
  //       desc: desc.value
  //     },
  //     refetchQueries: [{query:BookMarksQuery}],
  //   })
  //   console.log('textfield ===>', textfield.value);
  //   console.log('Description  ===>', desc.value);
  // }

  return (
    <div> 
      <div>
        {/* <input type='text' placeholder="Enter bookmark URL" ref={node => textfield=node} />
        <input type="text" placeholder="Description " ref={node => desc=node}/>
        <button onClick={addBookmarkSubmit}> Add Bookmrk </button> */}

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
          <Grid  key={d.id}>
            <div className="dataList">
              <div className="listBtn">
                <h3 style={{color: "white"}}> {d.desc} </h3>
                <Delete className="deletebtn" />
              </div> 

              <div>
                <a href={d.url} className="title" target="_blank"> {d.url} </a>
              </div>                      
            </div>
          </Grid>
        )} 
        </Grid> 
      </div>
    </div>
  ) 
}