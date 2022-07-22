import React from 'react';
import {useState, useEffect} from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import './app.css';

class Person {
    constructor(id, name, age, occupation, healthConditions) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.occupation = occupation;
        this.healthConditions = healthConditions;
        this.priority = this.priorityValue();
    }
    priorityValue() {
        let value = 0;
        let highRiskJobs = {'doctor': 10, 'dentist': 10, 'nurse': 10, 'cashier': 7, 'teacher': 7, 'professor': 7, 'EMT': 10};
        const agePriority = (age) => {
            let priority = 0;
            if (age > 100) priority += 10;
            else if (age > 65 && age < 100) priority += 8;
            else if (age > 40 && age < 65) priority += 6;
            else if (age > 20 && age < 40) priority += 4;
            else priority += 2;
            return priority;
        }
        if (!(this.job in highRiskJobs)) value += 5;
        else value += highRiskJobs[this.job];
        value += agePriority(this.age);
        if (this.healthConditions) value += 10;
        return value - this.id;
    }
}

const Title = styled.div`
    font-size: 150%;
    font-family: Courier;
    margin: auto 0;
`; 

const Page = styled.div`
    background-image: linear-gradient(to bottom, beige, white);
    width: 100%;
    height: 100vh;
`;
const Container = styled.div`
    width: 100%;
    padding: 5%;
    display: flex;ß
`;

const InputBox = styled.div`
    width: 90%;
    height: 50%;
    display: flex;
    margin: auto 0;
    background-color: white;
`;

const Input = styled.div`
    width: 20%;
    padding: 2%;
    margin: auto;
`;

const Inp = styled.input`
    width: 70%;
`;

const Line = styled.div`
    padding: 3%;
    margin: auto 0;
`;

const Enter = styled.button`
    padding: 2%;
    font-size: 100%;
    background-color: black;
    font-family: Courier;
    color: white;
`;

const titleVariants = {
    hidden: { opacity: 1},
    visible: {
        opacity: 1,
        transition: {
            delay: 0.5,
            staggerChildren: 0.1
        }
    }
}

const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0
    }
}

const Header = () => {
    return (
        <>
        <Container id="header">
            <Title as={motion.div} variants={titleVariants} initial={'hidden'} animate={'visible'}>
                {'COVID Vaccine Priority Queue'.split('').map((char, i) => {
                    return (
                        <motion.span key={char + i} variants={letter}>{char}</motion.span>
                    )
                })}
            </Title>
        </Container>
        </>
    );
}

const Queue = () => {
    const [PQ, setPQ] = useState([]);
    const [id, setId] = useState(1);
    
    const fetchInfo = () => {
        const ID = id;
        setId(id => id + 1);
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const job = document.getElementById("job").value;
        const health = document.getElementById("health").value;
        return health == 'yes' ? new Person(id, name, age, job, true) : new Person(id, name, age, job, false);
    }
    const enqueue = () => {
        let newPerson = fetchInfo();
        if (newPerson.name == '') return;
        let updatedPQ = [newPerson, ...PQ];
        let sortedPQ = updatedPQ.sort((a, b) => {
            return a.priority - b.priority;
        });
        setPQ(sortedPQ);
        clear();
    }
    const dequeue = () => {
        let newPQ = PQ.slice(0, PQ.length - 1);
        setPQ(newPQ);
    }
    const clear = () => {
        document.getElementById("name").value = '';
        document.getElementById("age").value = '';
        document.getElementById("job").value = '';
        document.getElementById("health").value = '';
    }
    return (
        <>
        <Container id="input">
            <InputBox>
                <Input>Name<br></br>
                    <Inp id="name"></Inp>
                </Input>
                <Input>Age<br></br>
                    <Inp id="age"></Inp>
                </Input>
                <Input>Occupation<br></br>
                    <Inp id="job"></Inp>
                </Input>
                <Input>Has Health Conditions<br></br>
                    <Inp id="health"></Inp>
                </Input>
                <Enter as={motion.button} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={enqueue}>Enqueue</Enter>
                <Enter as={motion.button} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={dequeue}>Vaccinate Next</Enter>
            </InputBox>
        </Container>
        <Container id="queue">
            {PQ.map((person) => <Line key={person.id.toString()}>{person.name}</Line>)}
        </Container>
        </>
    );
}

const App = () => {
    
    return (
        <>
        <Page>
            <Header/>
            <Queue/>
        </Page>
        </>
    );
}

export default App;