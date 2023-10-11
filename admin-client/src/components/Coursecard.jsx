import React from 'react';
import { Button, Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function Coursecard({ course }) {
    const navigate = useNavigate();

    return (
        <Card style={{
            margin: 10,
            width: 300,
            minHeight: 200,
            padding: 20,
        }}>
            <Typography textAlign={'center'} variant='h5'>{course.title}</Typography>
            <Typography textAlign={'center'} variant='subtitle1'>{course.description}</Typography>
            <img src={course.imageLink} style={{ width: 300 }} alt={course.title} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <Button
                    variant='contained'
                    size='large'
                    onClick={() => {
                        navigate(`/course/${course._id}`);
                    }}
                >
                    UPDATE
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    onClick={() => {
                        navigate(`/addvideo/${course._id}`);
                    }}
                >
                    View
                </Button>
            </div>
        </Card>
    );
}

export function Videocard({ course }) {
    const navigate = useNavigate();

    return (
        <Card style={{
            margin: 10,
            width: 300,
            minHeight: 200,
            padding: 20,
        }}>
            <Typography textAlign={'center'} variant='h5'>{course.title}</Typography>
            <Typography textAlign={'center'} variant='subtitle1'>{course.description}</Typography>
            <img src={course.imageLink} style={{ width: 300 }} alt={course.title} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Button
                    variant='contained'
                    size='large'
                    onClick={() => {
                        navigate(`/addvideo/${course._id}`);
                    }}
                >
                    View content
                </Button>
            </div>
        </Card>
    );
}
