import React, { useState } from 'react';
import logoImg from '../../assets/logo.svg'
import { FiPower, FiClock } from 'react-icons/fi';
import { Container, Header, HeaderContent, Profile, 
    Content, Schedule, Calendar, NextAppointment, Appointment, Section } from './styles';
import { useAuth } from '../../hooks/AuthContext';
import { userInfo } from 'os';

const Dashboard: React.FC = () => {
    const [selectedDate, setSelectDate] = useState(new Date()); /*estado para alterar o dia
    que os agendamentos serão mostrados, a partir do calendario*/
    const {signOut, user} = useAuth();

    return (
    <Container>
        <Header>
            <HeaderContent>
                <img src={logoImg} alt="GoBarber" />

                <Profile>
                    <img 
                        src={user.avatar_url}
                        alt={user.name}
                   />
                   <div>
                        <span>Bem-vindo,</span>
                        <strong>{user.name}</strong>
                   </div>
                </Profile>

                <button type="button" onClick={signOut} > <FiPower/> </button>
            </HeaderContent>
        </Header>
        <Content>
            <Schedule>
                <h1>Horários agendados</h1>
                <p>
                    <span>Hoje</span>
                    <span>Dia 06</span>
                    <span>Segunda</span>
                </p>

                <NextAppointment>
                    <strong>Atendimento a seguir</strong>
                    <div>
                        <img src="https://avatars2.githubusercontent.com/u/50455727?s=460&u=b32c35abedb51c2f52cbd002013832ba0ec67642&v=4" alt="Thiago"/>
                        <strong>Thiago Silveira</strong>
                        <span><FiClock/>08:00</span>
                    </div>
                </NextAppointment>

                <Section>
                    <strong>Manhã</strong>
                    <Appointment>
                        <span>
                            <FiClock/>
                            08:00
                        </span>

                        <div>
                            <img src="https://avatars2.githubusercontent.com/u/50455727?s=460&u=b32c35abedb51c2f52cbd002013832ba0ec67642&v=4" 
                            alt="Thiago"/>
                            <strong>Thiago Silveira</strong>
                        </div>
                    </Appointment>
                </Section>

                <Section>
                    <strong>Tarde</strong>
                    <Appointment>
                        <span>
                            <FiClock/>
                            13:00
                        </span>

                        <div>
                            <img src="https://avatars2.githubusercontent.com/u/50455727?s=460&u=b32c35abedb51c2f52cbd002013832ba0ec67642&v=4" 
                            alt="Thiago"/>
                            <strong>Thiago Silveira</strong>
                        </div>
                    </Appointment>
                </Section>
            </Schedule>
            <Calendar />
        </Content>
    </Container>)
}

export default Dashboard;