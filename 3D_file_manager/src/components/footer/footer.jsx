import './footer.css'
import { useTranslation } from 'react-i18next';

function Footer() {
    const { t } = useTranslation();
    return (
    <footer>
    <div class="footer-container">
        <div className="footer-section" id="info">
            <p className=''>
            {t("footer_text7")}
            <a href="../about-us">{t("footer_text6")} </a> <br/>
            {t("footer_text1")}
            <a href="../help">{t("footer_text5")} </a> {t("footer_text2")} <br/> {t("footer_text8")}
            <a href="https://github.com/your-repo-link" target="_blank">{t("footer_text4")}</a>
            </p>        
        </div>
        <div className="footer-section">
            <a target='_blank' className= "logo" href="https://www.mercantec.dk/">
                <div id="mercantec_logo_footer"></div>
            </a>
            <p>&copy; {t("footer_copy")}</p>
        </div>
        <div className="footer-section" id="contact">
            <h4>{t("footer_info")}</h4>
            <p>{t("footer_mail")}: <a href="mailto:hotskp@mercantec.dk">hotskp@mercantec.dk</a></p>
            <p>{t("footer_phone")}: 89 50 34 25</p>
        </div>
    </div>
    </footer>
);
}   

export default Footer;