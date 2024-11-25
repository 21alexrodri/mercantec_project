import './help_page.css';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faUsers, faTags, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../context/UserContext';
/**
 * A simple error page that appears when the user enters to a non-existing URL
 * 
 */
function Error_Page() {
    const { t } = useTranslation();
    const {isAdmin} = useContext(UserContext);

    return (
        <div className="help_box">
        <div className='help_page'>
            <h2>Instructions</h2>
            <p>This website is a 3D file manager. It allows you to upload and download 3D files in a secure and easy way. The website is divided into four main sections:</p>
            <h3>Home Page</h3>
            <p>The home page is the main page of the website. It shows the print jobs and has a filtering option, with the possibility to filter by <b>printjob name, date, tags, customer, colors, 
            layer thickness and material.</b> <br /> <br />
            It also has the upload button 
                <button className='example_upload-button'>+</button>
            for the logged in users. This button will open a popup where the user can upload a 3D job. With the fields:
            <ul className='upload_files_list'>
                <li>Project Name</li>
                <li>Description</li>
                <li>Privacity</li>
                <li>Tags</li>
                <li>Scale</li>
                <li>Color</li>
                <li>Material</li>
                <li>Layer Thickness</li>
                <li>Customer</li>
                <li>Files</li>
            </ul>
            </p><br />
            <p>There are two types of views on the Home Page, the standard view and the filtered view (shown when a filter is applied). Both of them show all the jobs to all the users except the licensed jobs that are 
                only visible to logged in users. In the filtered view, the logged in users will know that a project is licensed because of the <FontAwesomeIcon icon={faIdCard} /> icon.
            </p>
            {isAdmin && <p className='admin_msg'>As an admin, you can delete any project on the filtered view. You will need to apply one or more filter and then you
                will see at the top of the page a delete jobs button.</p>}

            <h3>Profile Page</h3>
            <p>This page shows the user's projects. Here, a user can suggest a new tag, a new customer and delete his own jobs. This </p>
            {isAdmin && <p className='admin_msg'>As an admin, you will have 3 more buttons. <br /><br />
            <ul className='upload_files_list'> 
            <li><FontAwesomeIcon icon={faUsers} /> Users: Here, an admin can activate/desactivate every user from the server. The admin can also make another users as admins or revoke the admin role to a user</li> <br />
            <li><FontAwesomeIcon icon={faTags} /> Tags: Here appears the tags suggested from the users and the accepted ones, an admin can accept, decline, disable, enable or delete a tag from the website.</li> <br />
            <li><FontAwesomeIcon icon={faBuilding} /> Customers: Here appears the customers suggested from the users and the accepted ones, an admin can accept, decline, disable, enable or delete a customer from the website. </li>
            </ul>    
            </p>}
            <h3>Uploading Files</h3>
            <p> If you want to upload a file, first of all you will have to log in into the page. If you don't have an account, you can also sign up and create an account (<b>NOTE: </b> 
            your account needs to be activated by an admin user).</p>
            <p>If you are logged in, you will see on the main page the upload button that will open a popup with all the fields</p>
        </div>
        </div>
    );
}

export default Error_Page;