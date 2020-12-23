import React, { useState, useCallback, useEffect, useMemo } from 'react';
import logoImg from '../../assets/logo.svg'
import { FiPower, FiClock } from 'react-icons/fi';
import { Container, Header, HeaderContent, Profile, 
    Content, Schedule, Calendar, NextAppointment, Appointment, Section } from './styles';
import { useAuth } from '../../hooks/AuthContext';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css'
import api from '../../services/api';
import { isToday, format, isAfter} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';

/*Define a tipagem do monthavailabilty, facilita pro react
padrão seguido no node e no insomnia, de dia e disponibilidade*/
interface monthAvailabilityItem {
    day: number;
    available: boolean;
}

interface IAppointment {
    id: string;
    date: string;
    hourFormatted: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const [selectedDate, setSelectDate] = useState(new Date()); /*estado para alterar o dia
    que os agendamentos serão mostrados, a partir do calendario*/
    const [currentMonth, setCurrentMonth] = useState(new Date()); /* identifica o mês selecionado
    no calendario, tendo q mostrar a disponibilidade das datas nele */
    const [monthAvailability, setMonthAvailability] = useState<monthAvailabilityItem[]>([]);
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const {signOut, user} = useAuth();

    /*Quando clicar na data, ele modifica o dia selecionado, se tiver disponibilidade */
    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers)=>{
        if(modifiers.available && !modifiers.disabled){
            setSelectDate(day);
        }
    }, []);

    const handleMonthChange = useCallback((month: Date)=>{
        setCurrentMonth(month);
    }, [])

    /*Toda vez que o mes atual mudar, gera um get com o endereço especificado, tendo que passar
    duas querys, aqui params, ano e mes*/
    useEffect(()=>{
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth()+1
            }
        }).then(response => { /*salva a resposta na variavel*/
            setMonthAvailability(response.data);
        })
    }, [currentMonth, user.id])

    /*Lista todos agendamentos do dia
    Irá retornar um array de appointments */
    useEffect(()=>{
        api.get<IAppointment[]>(`/appointments/me`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth()+1,
                day: selectedDate.getDate()
            }
        }).then(response => { /*salva a resposta na variavel*/
            /* Formata a data para poder mostrar a hora do agendamento, passando tambem
            o resto das informações necessarios pro agendamento */
            const appointmentsFormatted = response.data.map(appointmentVar => {
                return{...appointmentVar, 
                hourFormatted: format(parseISO(appointmentVar.date), 'HH:mm')}
            })
            
            setAppointments(appointmentsFormatted);
        })
    }, [selectedDate, user.id])

    /*Dentro do react deve utilizar os hooks, que geralmente começam com use;
    usememo permite executar funções caso ocorra mudança em variaveis
    A ideia, dentro do calendario, é pegar a data completa, pois temos apenas o dia
     e a disponibilidade, alem de filtrar os dias que nao estao disponiveis e as
     datas passadas */
    const disabledDays = useMemo(()=>{
        const dates = monthAvailability
        .filter(monthDay=>monthDay.available === false)
        .map(monthDayFiltered => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();

            return new Date(year, month, monthDayFiltered.day);
        })
        return dates;
    }, [currentMonth, monthAvailability]);
    
    /*Retorna a data selecionada formatada para mostrar no topo do agendamento */
    const selectedDateAsText = useMemo(()=>{
        return format(selectedDate, "dd 'de' MMMM",{
            locale: ptBR
        })
    }, [selectedDate]);

    /*Retorna a data selecionada formatada para mostrar no topo do agendamento */
    const selectedWeekDay = useMemo(()=>{
        return format(selectedDate, 'cccc', {locale: ptBR})
    }, [selectedDate]);

    const morningAppointments = useMemo(()=>{
        return appointments.filter(appointmentVar => {
            return parseISO(appointmentVar.date).getHours() < 12;
        })
    }, [appointments]);

    const afternoonAppointments = useMemo(()=>{
        return appointments.filter(appointmentVar => {
            return parseISO(appointmentVar.date).getHours() >= 12;
        })
    }, [appointments]);

    const nextAppointment = useMemo(()=>{
        return appointments.find(appointmentVar=>
            isAfter(parseISO(appointmentVar.date), new Date()))
    }, [appointments]) 

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
                        <Link to="/profile">
                        <strong>{user.name}</strong>
                        </Link>
                   </div>
                </Profile>

                <button type="button" onClick={signOut} > <FiPower/> </button>
            </HeaderContent>
        </Header>
        <Content>
            <Schedule>
                <h1>Horários agendados</h1>
                <p>
                    {isToday(selectedDate) && <span>Hoje</span>}
                    <span>{selectedDateAsText}</span>
                    <span>{selectedWeekDay}</span>
                </p>

                {nextAppointment &&
                (<NextAppointment>
                    <strong>Agendamento a seguir</strong>
                    <div>
                        <img src={nextAppointment.user.avatar_url} 
                        alt={nextAppointment.user.name}/>

                        <strong>{nextAppointment.user.name}</strong>
                        <span><FiClock/>{nextAppointment.hourFormatted}</span>
                    </div>
                </NextAppointment>)}

                <Section>
                    <strong>Manhã</strong>
                    {morningAppointments.length===0 && (
                        <p>Nenhum agendamento neste período.</p>
                    )}
                    {morningAppointments.map(appointmentVar =>(
                         <Appointment key={appointmentVar.id}>
                         <span>
                             <FiClock/>
                             {appointmentVar.hourFormatted}
                         </span>
 
                         <div>
                             <img 
                             src={appointmentVar.user.avatar_url}
                             alt={appointmentVar.user.name}/>

                             <strong>{appointmentVar.user.name}</strong>
                         </div>
                     </Appointment>
                    ) 
                    )}
                   
                </Section>

                <Section>
                <strong>Tarde</strong>
                {afternoonAppointments.length===0 && (
                        <p>Nenhum agendamento neste período.</p>
                    )}
                    {afternoonAppointments.map(appointmentVar =>(
                         <Appointment key={appointmentVar.id}>
                         <span>
                             <FiClock/>
                             {appointmentVar.hourFormatted}
                         </span>
 
                         <div>
                             <img 
                             src={appointmentVar.user.avatar_url}
                             alt={appointmentVar.user.name}/>

                             <strong>{appointmentVar.user.name}</strong>
                         </div>
                     </Appointment>
                    ) 
                    )}
                </Section>
            </Schedule>
            <Calendar>
                <DayPicker 
                    weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                    fromMonth = {new Date()} //começar no dia e mes atual
                    disabledDays={[{daysOfWeek :[0,6]}, ...disabledDays]} /*desabilita fds
                    e faz um spread do vetor criado, pegando cada data contida indisponivel */
                    modifiers={{
                        available: {daysOfWeek: [1, 2, 3, 4, 5]} //permite utilizar classe
                    }}
                    selectedDays={selectedDate}
                    onMonthChange={handleMonthChange}
                    onDayClick={handleDateChange}
                    months={[
                        'Janeiro',
                        'Fevereiro',
                        'Março',
                        'Abril',
                        'Maio',
                        'Junho',
                        'Julho',
                        'Agosto',
                        'Setembro',
                        'Outubro',
                        'Novembro',
                        'Dezembro',
                    ]}
                />
            </Calendar>
        </Content>
    </Container>)
}

export default Dashboard;