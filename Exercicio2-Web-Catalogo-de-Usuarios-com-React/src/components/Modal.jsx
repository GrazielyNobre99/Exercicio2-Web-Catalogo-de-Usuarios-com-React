import React from 'react';
// Exibi o conteúdo do POST e permite fechá-lo

function Modal ({post, onClose}){
    // Caso não tenha POST não renderiza
    if (!post) return null;

    return(
        <>
        <div className="modal-overlay" onClick={onClose}>

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    
                <button className='modal-close' onClick={onClose}>Fechar</button>
                            
            <h3>{post.title}</h3>
            <p>{post.body}</p>

            </div>
        </div>
        </>
    )
}

export default Modal;