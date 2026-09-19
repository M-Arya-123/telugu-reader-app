type ClusterCardProps = {
  telugu: string;
  phonetic: string;
};

export default function ClusterCard({ telugu, phonetic }: ClusterCardProps) {
  return (
    <div>
      <div>{telugu}</div>
      <div>{phonetic}</div>
    </div>
  );
}
