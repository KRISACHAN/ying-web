interface HeaderProps {
    description?: string;
    name?: string;
    illustration?: 'small' | 'wide';
}

export default function Header({
    description,
    name,
    illustration,
}: HeaderProps) {
    if (!name && !description) return null;

    return (
        <header
            className={`event-header${illustration === 'wide' ? ' event-header--stage' : ''}`}
        >
            {illustration && (
                <div className="event-header__sprig" aria-hidden="true" />
            )}
            <h1>{name}</h1>
            {description && <p>{description}</p>}
        </header>
    );
}
