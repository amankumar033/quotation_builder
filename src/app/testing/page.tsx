"use client "
import LoadingSpinner from "../components/ui/LoadingSpinner"
export default function testing(){

return(
    <div>
    <LoadingSpinner />

// Custom variant and size
<LoadingSpinner variant="dots" size={32} color="#ef4444" />

// With tailwind classes
<LoadingSpinner className="mx-auto my-4" />

// Different variants
<LoadingSpinner variant="classic"  size={35}/>
<LoadingSpinner variant="dots" />
<LoadingSpinner variant="pulse" />
<LoadingSpinner variant="ring" />
</div>
)
}