import {Icon, Segment} from "semantic-ui-react";

export interface TicketCardProps {
    numTickets: number | undefined | null
}

export const TicketCard: React.FC<TicketCardProps> = ({numTickets}) => {
  return (
    <Segment>
      {numTickets ? (
        <p><Icon name='ticket' /> Ticket count is {numTickets}</p>
      ) : (<p>No tickets bought yet</p>
      )}
    </Segment>
  )
}