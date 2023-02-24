import { useRef } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';

const Tiny = (props) => {
  const editorRef = useRef(null);
  const axiosJWT = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const { desc, setDesc } = props;

  const my_upload_handler = async (blobInfo, progress) => {
    let data = new FormData();
    data.append('file', blobInfo.blob(), blobInfo.filename());

    try {
      const res = await axiosJWT.post(
        'http://localhost:9999/upload/image',
        data
      );
      console.log('res.data =>', res.data);
      return res.data.location;
    } catch (error) {
      console.log('upload handler error : ', error);
    }
  };
  return (
    <div className='tinyContainer'>
      <Editor
        apiKey={process.env.REACT_APP_TINY_API}
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={desc}
        onEditorChange={(newValue, editor) => setDesc(newValue)}
        init={{
          height: 500,
          menubar: 'insert',
          file_picker_types: 'file image media',
          image_uploadtab: true,
          images_file_types: 'jpg,jpeg,gif,png,svg,webp',
          images_upload_handler: my_upload_handler,
          plugins:
            'anchor lists advlist emoticons link autolink autoresize code codesample image',
          selector: 'textarea',
          browser_spellcheck: true,
          contextmenu: false,
          width: '100%',
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'image link | code codesample removeformat | anchor emoticons restoredraft',
          codesample_global_prismjs: true,
        }}
      />
    </div>
  );
};

export default Tiny;
