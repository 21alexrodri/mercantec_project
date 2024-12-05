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
            <section>
            <h2>{t("instructions")}</h2>
            <p>{t("instr_t1")}</p>
            <h3>{t("instr_hp")}</h3>
            <p>{t("instr_hp_t1")} <b>{t("instr_hp_t1_b")}</b> <br /> <br />
            {t("instr_hp_t2")}
                <button className='example_upload-button'>+</button>
                {t("instr_hp_t3")}
            <ul className='upload_files_list'>
                <li>{t("project_name")}</li>
                <li>{t("project_desc")}</li>
                <li>{t("privacity")}</li>
                <li>{t("tags")}</li>
                <li>{t("scale")}</li>
                <li>{t("color")}</li>
                <li>{t("material")}</li>
                <li>{t("layer_thickness")}</li>
                <li>{t("customer")}</li>
                <li>{t("files")}</li>
            </ul>
            </p><br />
            <p>{t("instr_hp_t4")} <FontAwesomeIcon icon={faIdCard} /> {t("icon")}.
            </p>
            {isAdmin && <p className='admin_msg'>{t("admin_t1")}</p>}

            <h3>{t("profile_page")}</h3>
            <p>{t("profile_t1")}</p>
            {isAdmin && <p className='admin_msg'>{t("admin_t2")}<br /><br />
            <ul className='upload_files_list'> 
            <li><FontAwesomeIcon icon={faUsers} />{t("admin_users")}</li> <br />
            <li><FontAwesomeIcon icon={faTags} />{t("admin_tags")}</li> <br />
            <li><FontAwesomeIcon icon={faBuilding} />{t("admin_customers")} </li>
            </ul>    
            </p>}
            <h3>{t("uploading_files")}</h3>
            <p>{t("ufiles_t1")} (<b>{t("note")} </b> 
            {t("ufiles_t2")}).</p>
            <p>{t("ufiles_t3")}</p>
            <p>{t("uploading_issue")}</p>
            {isAdmin && <p className='admin_msg'>{t("admin_solve")}</p>}
            <h3>{t("deleting_files")}</h3>
            <p>{t("dfiles_t1")}</p>
            {isAdmin && <p className='admin_msg'>{t("admin_t1")}</p>}
            <h3>{t("dwnd_files")}</h3>
            <p>{t("dwnd_t1")}
            </p>
            </section>
            <section>
            <h2>{t("tos")}</h2>
            <p><b>{t("effective_date")}: 25-11-2024</b></p>
            <p>{t("tos_t1")}</p>
            <h3>{t("tos_el")}</h3>
            <p>{t("tos_el_t1")}</p>
            <p>{t("tos_el_t2")}</p>
            <p>{t("tos_el_t3")}</p>
            <h3>{t("tos_ua")}</h3>
            <p>{t("tos_ua_t1")}</p>
            <p>{t("tos_ua_t2")}</p>
            <h3>{t("tos_usc")}</h3>
            <p>{t("tos_usc_t1")}</p>
            <p>{t("tos_usc_t2")}</p>
            <ul className='upload_files_list'>
            <li>{t("tos_usc_t3")}</li>
            <li>{t("tos_usc_t4")}</li>
            </ul>
            <p>{t("tos_usc_t5")}</p>
            <h3>{t("tos_pa")}</h3>
            <p>{t("tos_pa_t1")}</p>
            <ul className='upload_files_list'>
            <li>{t("tos_pa_t2")}</li>
            <li>{t("tos_pa_t3")}</li>
            <li>{t("tos_pa_t4")}</li>
            <li>{t("tos_pa_t5")}</li>
            </ul>
            <p>{t("tos_pa_t6")}</p>
            <h3>{t("tos_co")}</h3>
            <p>{t("tos_co_t1")}</p>
            <p>{t("tos_co_t2")}</p>
            <h3>{t("tos_li")}</h3>
            <p>{t("tos_li_t1")}</p>
            <p>{t("tos_li_t2")}</p>
            <p>{t("tos_li_t3")}</p>
            <h3>{t("tos_priv")}</h3>
            <p>{t("tos_priv_t1")}</p>
            <p>{t("tos_priv_t2")}</p>
            <h3>{t("tos_ct")}</h3>
            <p>{t("tos_ct_t1")}</p>
            <p>{t("tos_ct_t2")}</p>
            <h3>{t("tos_gl")}</h3>
            <p>{t("tos_gl_t1")}</p>
            <h3>{t("10. Contact")}</h3>
            <p>{t("tos_cnt_t1")}</p>
            <p>{t("email")}: hotskp@mercantec.dk</p>
            <p>{t("address")}: H C Andersens Vej 9 8800 Viborg</p>
            </section>
            <section>
            <h2>{t("pp")}</h2>
            <p><b>{t("effective_date")}: 25-11-2024</b></p>
            <h3>{t("pp_intro")}</h3>
            <p>{t("pp_intro_t1")}</p>
            <h3>{t("pp_inco")}</h3>
            <p>{t("pp_inco_t1")}</p>
            <ul className='upload_files_list'>
                <li><strong>{t("pp_inco_t2_p1")}</strong> {t("pp_inco_t2_p2")}</li>
                <li><strong>{t("pp_inco_t3_p1")}</strong> {t("pp_inco_t3_p2")}</li>
                <li><strong>{t("pp_inco_t4_p1")}</strong> {t("pp_inco_t4_p2")}</li>
            </ul>
            <h3>{t("pp_uoi")}</h3>
            <p>{t("pp_uoi_t1")}</p>
            <ul className='upload_files_list'>
                <li>{t("pp_uoi_t2")}</li>
                <li>{t("pp_uoi_t3")}</li>
                <li>{t("pp_uoi_t4")}</li>
            </ul>
            <h3>{t("pp_is")}</h3>
            <p>{t("pp_is_t1")}</p>
            <ul className='upload_files_list'>
                <li>{t("pp_is_t2")}</li>
                <li>{t("pp_is_t3")}</li>
                <li>{t("pp_is_t4")}</li>
            </ul>
            <h3>{t("pp_dr")}</h3>
            <p>{t("pp_dr_t1")}</p>
            <h3>{t("pp_sec")}</h3>
            <p>{t("pp_sec_t1")}</p>
            <h3>{t("pp_yr")}</h3>
            <p>{t("pp_yr_t1")}</p>
            <ul className='upload_files_list'>
            <li>{t("pp_yr_t2")}</li>
            <li>{t("pp_yr_t3")}</li>
            <li>{t("pp_yr_t4")}</li>
            <li>{t("pp_yr_t5")}</li>
            <li>{t("pp_yr_t6")}</li>
            </ul>
            <p>{t("pp_yr_t7")}</p>
            <h3>8. Cookies</h3>
            <p>{t("pp_ck_t1")}</p>
            <h3>{t("pp_cp")}</h3>
            <p>{t("pp_cp_t1")}</p>
            <h3>{t("pp_ctp")}</h3>
            <p>{t("pp_ctp_t1")}</p>
            <h3>{t("pp_cntct")}</h3>
            <p>{t("pp_cntct_t1")}</p>
            <p>{t("email")}: hotskp@mercantec.dk</p>
            <p>{t("address")}: H C Andersens Vej 9 8800 Viborg</p>
            </section>
            <section>
            <h2>Cookie {("policy")}</h2>
            <p><b>{t("effective_date")}: 25-11-2024</b></p>
            <h3>{t("ck_intro")}</h3>
            <p>{t("ck_intro_t1")}</p>
            <p>{t("ck_intro_t2")}</p>
            <h3>{t("ck_what")}</h3>
            <p>{t("ck_what_t1")}</p>
            <h3>{t("ck_cwu")}</h3>
            <p>{t("ck_cwu_t1")}</p>
            <ul className='upload_files_list'>
                <li><b>Session Cookie (PHPSESSID): </b>{t("ck_cwu_t3")}</li>
                <li><b>{t("ck_cwu_t2")} (i18nextLng): </b>{t("ck_cwu_t4")}</li>
            </ul>
            <h3>{t("ck_wwuc")}</h3>
            <p>{t("ck_wwuc_t1")}</p>
            <ul className='upload_files_list'>
            <li><b>{t("ck_wwuc_t2")}:</b> {t("ck_wwuc_t3")}</li>
            <li><b>{t("ck_wwuc_t4")}:</b> {t("ck_wwuc_t5")}</li>
            </ul>
            <h3>{t("ck_wwuc_t6")}</h3>
            <p>{t("ck_wwuc_t7")}</p>
        <p>{t("ck_wwuc_t8")}</p>
        <ul className='upload_files_list'>
            <li>Google Chrome: <a href="https://support.google.com/chrome/answer/95647" target="_blank">{t("ck_wwuc_t9")} Cookies</a></li>
            <li>Mozilla Firefox: <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank">{t("ck_wwuc_t9")} Cookies</a></li>
            <li>Microsoft Edge: <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank">{t("ck_wwuc_t9")} Cookies</a></li>
            <li>Safari: <a href="https://support.apple.com/en-us/HT201265" target="_blank">{t("ck_wwuc_t9")} Cookies</a></li>
        </ul>
        <h3>{t("ck_utcp")}</h3>
        <p>{t("ck_utcp_t1")}</p>
        <h3>{t("ck_cntct")}</h3>
        <p>{t("ck_cntct_t1")}</p>
        <p>{t("email")}: hotskp@mercantec.dk</p>
        <p>{t("address")}: H C Andersens Vej 9 8800 Viborg</p>
        </section>
        </div>
        </div>
    );
}

export default Error_Page;