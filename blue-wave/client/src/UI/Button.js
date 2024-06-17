import './Button.css'

const Button = ({className, id, text, onClick, disabled}) => {
    return(
            <button className={className} id={id} onClick={onClick} disabled={disabled}>{text}</button>
    )
}
export default Button;