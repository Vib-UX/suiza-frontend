import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import useGlobalStorage from '../../../store';

const steps = [
    {
        label: 'Connect Socials',
    },
    {
        label: 'Connect Gear',
    },
    {
        label: 'Launch',
    },
];

export default function VerticalLinearStepper() {
    const { activeStep } = useGlobalStorage();
    return (
        <Box>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === steps.length - 1 ? (
                                    <Typography>Last step</Typography>
                                ) : null
                            }
                        >
                            <Typography
                                variant="caption"
                                sx={{ color: 'white', fontSize: '1.5rem' }}
                            >
                                {step.label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography sx={{ color: 'white' }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
