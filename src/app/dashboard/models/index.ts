export interface Report{
    _id: string,
    customer_key: string,
    report_type: "FK" | "FU" | "K";
    broken_type: "SP" | "R" | "SR";
    progress: "A" | "P" | "S" | "T";
    complain_des: string,
    broken_des: string,
    status: boolean,
    admin_note: string,
    image: string
}


export interface Customer  {
    _id: string | "";
    username : string;
    password: string;
    room_key: Room;
    email : string;
    phone : number;
    bill_status: string;
    booking_status: string;
    role: string;
    checkIn: Date ;
    checkOut: Date;
}

export interface Facility {
  name: string;
  code: string;
  status: "good" | "warning" | "alert";
}


interface Room {
    name: string,
    code: string,
    price: number,
    facility: Facility[],
    status: boolean,
    customer_key: string,
    report_id: string,
    image: string
}