// utils/DateUtils.ts
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(
    date: string | Date,
    pattern = 'yyyy-MM-dd'
) {
    return format(
        typeof date === 'string' ? parseISO(date) : date,
        pattern,
        { locale: zhCN }
    );
}
