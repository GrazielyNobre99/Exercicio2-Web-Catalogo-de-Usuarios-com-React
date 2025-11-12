import React from 'react';

function Sobre (){
    return(
        <>
        <div className="page-content">
            <h2>Sobre esta Aplicação</h2>

            <div className="about-content">
                <p><strong>Sobre: </strong> Esta aplicação é um catálogo de usuários
                que demonstra o uso de React consumindo uma API, que neste caso é a <strong>API JSONPlacehouder</strong></p>

                <p><strong>Tecnologias Utilizadas: </strong>
                <ul>
                    <li>React, Fetch API, React Router</li>
                    <li>HTML5, CSS3</li>
                </ul>
                </p>

                <p><strong>Realizado por: </strong> Antônia Graziely Nobre Moreira</p>
            </div>

        </div>
        </>
    )
}

export default Sobre;