import styles from './Picker.module.scss'

export default function Picker({ options = [], onValueChange, selectedValue }) {

    if (!onValueChange) onValueChange = () => { }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>List Of Episodes :</h3>
            {options.map((opt, index) => (
                <div key={opt.id} className={`${styles.option} ${opt.id === selectedValue ? styles.selected : ''}`} onClick={() => onValueChange(opt.id)}>
                    <span>{opt.number}</span>
                    <span>{opt.title.replaceAll('Eps', '').replaceAll(/\d:/g, '')}</span>
                </div>
            ))}
        </div>
    )
}
