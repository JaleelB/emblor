import { Children, cloneElement, isValidElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ChildElement = ReactElement<{ children?: ReactNode; 'data-label'?: string }>;

function plainText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!isValidElement<{ children?: ReactNode }>(node)) return '';
  return Children.toArray(node.props.children).map(plainText).join(' ').trim();
}

export function ResponsiveTable({ children, className, ...props }: ComponentProps<'table'>) {
  const sections = Children.toArray(children).filter(isValidElement) as ChildElement[];
  const head = sections.find((section) => section.type === 'thead');
  const body = sections.find((section) => section.type === 'tbody');
  const headerRow = head
    ? (Children.toArray(head.props.children).find(isValidElement) as ChildElement | undefined)
    : undefined;
  const labels = headerRow ? Children.toArray(headerRow.props.children).map(plainText) : [];

  const labeledBody = body
    ? cloneElement(body, {
        children: Children.map(body.props.children, (row) => {
          if (!isValidElement<{ children?: ReactNode }>(row)) return row;
          return cloneElement(row, {
            children: Children.map(row.props.children, (cell, index) => {
              if (!isValidElement<{ children?: ReactNode; 'data-label'?: string }>(cell)) return cell;
              return cloneElement(cell, {
                'data-label': labels[index] ?? '',
                children: <span className="responsive-table-value">{cell.props.children}</span>,
              });
            }),
          });
        }),
      })
    : body;

  return (
    <table className={cn('responsive-table', className)} {...props}>
      {sections.map((section) => (section === body ? labeledBody : section))}
    </table>
  );
}
