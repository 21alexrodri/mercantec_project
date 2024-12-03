import './aboutme.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * About me page
 * @returns The about me page
 */
function AboutMe() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div className="help_box">
            <div className='help_page'>
                <section>
                    <h2>{t("aboutus")}</h2>
                    <p>{t("aboutus_t1")}</p>
                    <h2>{t("aboutus_mercantec")}</h2>
                    <h3>{t("aboutus_merc_miss")}</h3>
                    <p>{t("aboutus_merc_miss_t1")}</p>
                    <p>{t("aboutus_merc_miss_t2")}</p>
                    <p>{t("aboutus_merc_miss_t3")}</p>
                    <h3>{t("aboutus_merc_vis")}</h3>
                    <p>{t("aboutus_merc_vis_t1")}</p>
                    <p>{t("aboutus_merc_vis_t2")}</p>
                </section>
                <section>
                    <h2>{t("about_devs")}</h2>
                    <p>{t("about_devs_t1")}</p>
                    <div className='dev-portraits'>
                        <div className='dev-box dev-adrian'>
                            <a href='https://github.com/AdrianCasadoAguilera'><img className='portrait-img portrait-adrian' src='/3D_printer/Files/img/profile/portrait_adrian.png'></img></a>
                            <div>
                                <p>Adrián Casado Aguilera</p>
                                <p>Web Full-Stack Developer</p>
                            </div>
                        </div>
                        <div className='dev-box dev-alex'>
                            <a href='https://github.com/21alexrodri'><img className='portrait-img portrait-alex' src='/3D_printer/Files/img/profile/portrait_alex.png'></img></a>
                            <div>
                                <p>Àlex Rodríguez Benítez</p>
                                <p>Web Full-Stack Developer</p>
                            </div>
                        </div>
                        <div className='dev-box dev-marc'>
                            <a href='https://github.com/MarcArques'><img className='portrait-img portrait-marc' src='/3D_printer/Files/img/profile/portrait_marc.png'></img></a>
                            <div>
                                <p>Marc Arqués Marimón</p>
                                <p>Web Full-Stack Developer</p>
                            </div>
                        </div>
                        <div className='dev-box dev-nil'>
                            <a href='https://github.com/nil0j'><img className='portrait-img portrait-nil' src='/3D_printer/Files/img/profile/portrait_nil.png'></img></a>
                            <div>
                                <p>Nil Jimeno Ogaya</p>
                                <p>Server Deployment</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutMe;