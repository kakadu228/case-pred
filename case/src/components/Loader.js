import React from 'react'

export const Loader = () => {
    return(
        <div class="spinner-layer spinner-green" style={{display: 'flex', justifyContent:'center', paddingTop: '2rem'}}>
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>
    )
}