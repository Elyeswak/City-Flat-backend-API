import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/footer';


import './Notifications.css'

function Notifications() {
  return (
    <div className='notifications_page'>
        <Navbar/>
    <section className="section-50">
    <div className="container">
        <h3 className="m-b-50 heading-line">Notifications <i className="fa fa-bell text-muted"></i></h3>

        <div className="notification-ui_dd-content">
            <div className="notification-list notification-list--unread">
                <div className="notification-list_content">
                    <div className="notification-list_img">
                        <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user"/>
                    </div>
                    <div className="notification-list_detail">
                        <p><b>John Doe</b> reacted to your post</p>
                        <p className="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
                        <p className="text-muted"><small>10 mins ago</small></p>
                    </div>
                </div>
                <div className="notification-list_feature-img">
                    <img src="https://i.imgur.com/AbZqFnR.jpg" alt="Feature image"/>
                </div>
            </div>
            <div className="notification-list notification-list--unread">
                <div className="notification-list_content">
                    <div className="notification-list_img">
                        <img src="https://i.imgur.com/w4Mp4ny.jpg" alt="user"/>
                    </div>
                    <div className="notification-list_detail">
                        <p><b>Richard Miles</b> liked your post</p>
                        <p className="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
                        <p className="text-muted"><small>10 mins ago</small></p>
                    </div>
                </div>
                <div className="notification-list_feature-img">
                    <img src="https://i.imgur.com/AbZqFnR.jpg" alt="Feature image"/>
                </div>
            </div>
            <div className="notification-list">
                <div className="notification-list_content">
                    <div className="notification-list_img">
                        <img src="https://i.imgur.com/ltXdE4K.jpg" alt="user"/>
                    </div>
                    <div className="notification-list_detail">
                        <p><b>Brian Cumin</b> reacted to your post</p>
                        <p className="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
                        <p className="text-muted"><small>10 mins ago</small></p>
                    </div>
                </div>
                <div className="notification-list_feature-img">
                    <img src="https://i.imgur.com/bpBpAlH.jpg" alt="Feature image"/>
                </div>
            </div>
            <div className="notification-list">
                <div className="notification-list_content">
                    <div className="notification-list_img">
                        <img src="https://i.imgur.com/CtAQDCP.jpg" alt="user"/>
                    </div>
                    <div className="notification-list_detail">
                        <p><b>Lance Bogrol</b> reacted to your post</p>
                        <p className="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
                        <p className="text-muted"><small>10 mins ago</small></p>
                    </div>
                </div>
                <div className="notification-list_feature-img">
                    <img src="https://i.imgur.com/iIhftMJ.jpg" alt="Feature image"/>
                </div>
            </div>
            <div className="notification-list">
                <div className="notification-list_content">
                    <div className="notification-list_img">
                        <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user"/>
                    </div>
                    <div className="notification-list_detail">
                        <p><b>Parsley Montana</b> reacted to your post</p>
                        <p className="text-muted">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, dolorem.</p>
                        <p className="text-muted"><small>10 mins ago</small></p>
                    </div>
                </div>
                <div className="notification-list_feature-img">
                    <img src="https://i.imgur.com/bpBpAlH.jpg" alt="Feature image"/>
                </div>
            </div>
        </div>

        <div className="text-center">
            <a href="#!" className="dark-link">Load more activity</a>
        </div>

    </div>
</section>
<Footer/>
</div>
  )
}

export default Notifications