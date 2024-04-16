import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmDialog =   (props) =>{
  
  const {title ,message, btnOkLabel='Ok', btnKoLabel='Close', handleOkCall, params={param:null}, showDlg} = props
    const [show, setShow] = useState(props.showDlg);
    const handleClose = () => showDlg.showModal=false;
    
    const executeFeedBackMethod=  () =>{
        if(props.params){
            props.handleOkCall(params.param);
        }else{
            props.handleOkCall();
        }
          props.handleClose();  
    }



    return (
        <Modal show={showDlg.shoModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {props.btnKoLabel}
          </Button>
          <Button variant="primary" onClick={executeFeedBackMethod}>
          {props.btnOkLabel}
          </Button>
        </Modal.Footer>
      </Modal>

);

}

export default ConfirmDialog;