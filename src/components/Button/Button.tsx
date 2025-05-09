import styles from './Button.module.scss';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger' | 'blended';
    size?: 'small' | 'medium' | 'large';
    decorated?: boolean;
    text?: string;
};

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    decorated = true,
    text,
    className,
}) => {
    return (
        <button
            className={clsx(
                className,
                styles.button,
                styles[variant],
                styles[size],
                decorated ? '' : 'remove-decoration'
            )}
        >
            <span>{text}</span>
        </button>
    );
};

export default Button;
